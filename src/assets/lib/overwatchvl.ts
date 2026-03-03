


const API = "https://overwatch.vlviewer.com/"
const configPointerURL = `${API}config-pointer.json`

export interface Voiceline {
    date: string,
    filename: string,
    transcription: string,
    voiceline_id: string,
    url: string
}


function findAllCharacterVoiceLines(voicelineObject: any, audioFolderPath: string, voicelines: Voiceline[] = [])
{
    for(let key in voicelineObject)
    {
        let element = voicelineObject[key]

        if("filename" in element)
        {
            voicelines.push({
                ...element,
                url: `${API}${audioFolderPath}/${element.filename}`
            })
        }
        else
        {
            findAllCharacterVoiceLines(element, audioFolderPath, voicelines)
        }
    }
    return voicelines
}

export async function loadVoiceLines(): Promise<Voiceline[]>
{
    const configPointerResult = await fetch(configPointerURL)
    const configUrl: string = (await configPointerResult.json()).config

    const configJson = await (await fetch(`${API}${configUrl}`)).json()

    const audioFolderPath = configJson.audioFolder
    const voicelineFilePath: string = configJson.voicelineFile

    const voicelinesFile = await (await fetch(`${API}${voicelineFilePath}`)).json()

    const voicelines = findAllCharacterVoiceLines(voicelinesFile.roadhog, audioFolderPath)

    return voicelines

}
