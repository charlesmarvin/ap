const express = require('express')
const expressWs = require('express-ws')
const next = require('next')
const bodyParser = require('body-parser')

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()
const boards = {}
const connections = {}

function UUID () {
  var d = new Date().getTime()
  if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
    d += performance.now() // use high-precision timer if available
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (d + Math.random() * 16) % 16 | 0
    d = Math.floor(d / 16)
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
  })
}

app.prepare()
  .then(() => {
    const wsServer = expressWs(express())
    const server = wsServer.app
    server.use(bodyParser.json())

    const broadcast = (data, ws, targetSelf = false) => {
      wsServer.getWss().clients.forEach((client) => {
        if (/* client.readyState === WebSocket.OPEN && */ (client !== ws || targetSelf)) {
          client.send(JSON.stringify(data))
        }
      })
    }

    wsServer.getWss().on('connection', (ws) => {
      const id = UUID()
      console.log('New Client connection. Assigning ID: ', id)
      connections[id] = ws
    })

    const broadcastAll = (data, ws) => {
      broadcast(data, ws, true)
    }
    const getUserIdFromConnection = (ws) => {
      for (let id in connections) {
        if (connections[id] === ws) {
          return id
        }
      }
      return null
    }
    server.ws('/ws', (ws, req) => {
      ws.on('message', (message) => {
        const userId = getUserIdFromConnection(ws)
        const event = JSON.parse(message)
        const {params} = event

        switch (event.action) {
          case 'JOIN_BOARD': {
            const {boardId} = params
            const board = boards[boardId]
            if (!board) return
            board.members[userId] = {
              voted: false,
              vote: null
            }

            broadcastAll({
              type: 'NEW_MEMBER',
              params: {
                members: board.members
              }
            }, ws)
            break
          }
          case 'CREATE_BOARD': {
            const {boardName, boardType} = params
            const board = {
              id: UUID(),
              sessionId: `${Math.floor(10000000 + Math.random() * 90000000)}`.replace(/(\d{4})(\d{4})/, '$1-$2'),
              members: {
                [userId]: {
                  voted: false,
                  vote: null
                }
              },
              boardName,
              boardType
            }
            boards[board.id] = board
            break
          }
          case 'CAST_VOTE': {
            const {boardId, selection} = params
            const board = boards[boardId]
            const user = board.members[userId]
            user.voted = true
            user.vote = selection
            broadcastAll({
              type: 'NEW_VOTE',
              params: {
                members: board.members
              }
            }, ws)
            break
          }
          case 'REVEAL_BOARD':
            const {boardId} = params
            const board = boards[boardId]
            broadcastAll({
              type: 'BOARD_REVEALED',
              params: {
                members: board.members
              }
            }, ws)
            break
        }
        console.log('message: ', event)
      })

      ws.on('close', () => {
        const userId = getUserIdFromConnection(ws)
        Object.keys(boards).forEach(boardId => {
          const board = boards[boardId]
          const {members} = board
          delete members[userId]
          broadcast({
            type: 'PARTICIPANTS_UPDATED',
            params: {
              boardId,
              members
            }
          }, ws)
        })
      })
    })

    // const wsHandler = wsServer.getWss('/ws')

    server.post('/api/boards', (req, res) => {
      console.log('got post to board', req.body)
      const {boardName, boardType} = req.body
      const board = {id: UUID(), boardName, boardType, members: {}}
      boards[board.id] = board
      res.json(board)
    })

    server.get('/api/boards/:id', (req, res) => {
      console.log('handling GET boards/', req.params.id)
      const board = boards[req.params.id]
      console.log('returning board: ', board)
      if (board) {
        res.json(board)
      } else {
        res.status(404).json({})
      }
    })

    server.get('/b/:id', (req, res) => {
      const actualPage = '/board'
      const queryParams = { id: req.params.id }
      app.render(req, res, actualPage, queryParams)
    })

    server.get('*', (req, res) => {
      return handle(req, res)
    })

    server.listen(port, (err) => {
      if (err) throw err
      console.log(`> Server Ready. port=,${port}`)
    })
  })
  .catch((ex) => {
    console.error(ex.stack)
    process.exit(1)
  })
