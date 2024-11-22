const fs = require('fs')
const wavefile = require('wavefile')

const getTTSaudio = async (req, res) => {
    console.log("tts called")
    try {
        const textToGenerateAudioFrom = req.body.text
        const { pipeline } = await import('@xenova/transformers')

        const synthesizer = await pipeline('text-to-speech', 'Xenova/speecht5_tts', { quantized: false })

        const speaker_embeddings = 'https://huggingface.co/datasets/Xenova/transformers.js-docs/resolve/main/speaker_embeddings.bin'

        const result = await synthesizer(textToGenerateAudioFrom, { speaker_embeddings })

        console.log(result)

        const wav = new wavefile.WaveFile()
        wav.fromScratch(1, result.sampling_rate, '32f', result.audio)
        fs.writeFileSync('./result.wav', wav.toBuffer())

        res.status(200).send('Audio generated successfully')
        
    } catch (error) {
        console.error('Error generating audio:', error)
        res.status(500).send('Error generating audio')
    }
}

module.exports = { getTTSaudio }