import { useActions, useValues } from 'kea'
import { IconUploadFile } from 'lib/lemon-ui/icons'
import Dragger from 'antd/lib/upload/Dragger'
import { SessionRecordingPlayer } from '../player/SessionRecordingPlayer'
import { SpinnerOverlay } from 'lib/lemon-ui/Spinner/Spinner'
import { LemonBanner } from 'lib/lemon-ui/LemonBanner'
import { sessionRecordingFilePlaybackLogic } from './sessionRecordingFilePlaybackLogic'
import { userLogic } from 'scenes/userLogic'
import { AvailableFeature } from '~/types'
import { PayGatePage } from 'lib/components/PayGatePage/PayGatePage'

export function SessionRecordingFilePlayback(): JSX.Element {
    const { loadFromFile, resetSessionRecording } = useActions(sessionRecordingFilePlaybackLogic)
    const { sessionRecording, sessionRecordingLoading, playerKey } = useValues(sessionRecordingFilePlaybackLogic)
    const { hasAvailableFeature } = useValues(userLogic)
    const filePlaybackEnabled = hasAvailableFeature(AvailableFeature.RECORDINGS_FILE_EXPORT)

    if (!filePlaybackEnabled) {
        return (
            <PayGatePage
                featureKey={AvailableFeature.RECORDINGS_FILE_EXPORT}
                featureName="Recording Exports"
                header={
                    <>
                        Export and playback <span className="highlight">Recordings from file</span>!
                    </>
                }
                caption="Store your recordings outside of PostHog wherever you like."
                docsLink="https://posthog.com/docs/user-guides/session-recordings"
            />
        )
    }

    return (
        <div>
            {sessionRecordingLoading ? (
                <SpinnerOverlay />
            ) : sessionRecording ? (
                <div className="space-y-2">
                    <LemonBanner
                        type="info"
                        action={{
                            onClick: () => resetSessionRecording(),
                            children: 'Load a different recording',
                        }}
                    >
                        You are viewing a recording loaded from a file.
                    </LemonBanner>
                    <SessionRecordingPlayer sessionRecordingId="" playerKey={playerKey} />
                </div>
            ) : (
                <Dragger
                    name="file"
                    multiple={false}
                    accept=".json"
                    showUploadList={false}
                    beforeUpload={(file) => {
                        loadFromFile(file)
                        return false
                    }}
                >
                    <div className="p-20 flex flex-col items-center justify-center space-y-2 text-muted-alt">
                        <p className="flex items-center gap-2 font-semibold">
                            <IconUploadFile className="text-xl" />
                            Load recording
                        </p>
                        <p className="text-muted-alt ">
                            Drag and drop your exported recording here or click to open the file browser.
                        </p>
                    </div>
                </Dragger>
            )}
        </div>
    )
}
