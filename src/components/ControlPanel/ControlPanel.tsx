import { ArrowCounterClockwise, Pause, Play, Stop } from "phosphor-react"
import { Dispatch, FC, MouseEventHandler, SetStateAction } from "react"

import "./ControlPanel.css"

type ActionButtonProps = {
  render: FC<any>,
  action?: MouseEventHandler<HTMLButtonElement>
}

const ActionButton: FC<ActionButtonProps> = function({
  render: Icon,
  action
}) {
  return (
    <button onClick={action}>
      <Icon size={15} weight="fill"/>
    </button>
  )
}

type ControlPanelProps = {
  controls: {
    play: () => void,
    pause: () => void,
    stop: () => void,
    reset: () => void,
    setSpeed: Dispatch<SetStateAction<number>>
  }
}

const ControlPanel: FC<ControlPanelProps> = function({
  controls
}) {
  return (
    <div id="control-panel">
      <ActionButton
        render={Play}
        action={controls.play}
      />
      <ActionButton
        render={Pause}
        action={controls.pause}
      />
      <ActionButton
        render={Stop}
        action={controls.stop}
      />
      <ActionButton
        render={ArrowCounterClockwise}
        action={controls.reset}
      />

      <label htmlFor="speed">
        speed:
      </label>
      <input
        name="speed"
        type="number"
        min="1"
        max="10000"
        defaultValue="1"
        onChange={e => controls.setSpeed(parseInt(e.target.value))}
      /> ms
    </div>
  )
}

export default ControlPanel
