
import Share from '../components/board/Share'
import NewBoardButton from '../components/board/NewBoardButton'

const Index = () => (
  <div>
    <dl>
      <dt>a p</dt>
      <dd>
        <ul>
          <li>Agile Planning.</li>
          <li>a "train hack" project I started on a NYP to BOS Amtrak.</li>
          <li>a tool for facilitating Planning Poker on remote teams.</li>
          <li>Click the {<NewBoardButton />} to create a new board. Click the {<Share />} to copy the link to share the board.</li>
        </ul>
      </dd>

      <dt>train hack</dt>
      <dd>a project started on a train ride to try out some technology or idea.</dd>

      <dt>Planning Poker</dt>
      <dd>
        a consensus-based, gamified technique for estimating, mostly used to estimate
        effort or relative size of development goals in software development. In
        planning poker, members of the group make estimates by playing numbered cards
        face-down to the table, instead of speaking them aloud. The cards are revealed,
        and the estimates are then discussed. By hiding the figures in this way, the
        group can avoid the cognitive bias of anchoring, where the first number spoken
        aloud sets a precedent for subsequent estimates. Also called Scrum poker.
      </dd>
    </dl>
  </div>
)

export default Index
