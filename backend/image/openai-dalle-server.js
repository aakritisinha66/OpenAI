const express = require('express');
const { OpenAI, toFile } = require('openai');
const path = require('path');
// const fs = require('fs').promises; // createReadStream is a method on the regular ('fs') not on ('fs').promises.
const util = require('util'),
    request = util.promisify(require('request')),
    fs = require('fs'),
    fsp = fs.promises;

const app = express();
const port = 8002;

app.use(express.json({ limit: '10mb' }));

const openai = new OpenAI();

app.post('/generate-image', async (req, res) => {
    try {
        // Convert the image using OpenAI API
        const image = await openai.images.generate({
            model: 'dall-e-2',
            prompt: req.body.prompt,
            n: 1,
            size: '1024x1024',
            response_format: 'b64_json',
        });

        // Check if the image data is present in the response
        if (!image.data || !Array.isArray(image.data) || image.data.length === 0) {
            throw new Error('Invalid or missing image data in the response.');
        }

        // Assume the first element in the array contains the image data
        const firstImageData = image.data[0];

        // Check if the firstImageData has the expected property
        if (!firstImageData || typeof firstImageData.b64_json !== 'string') {
            throw new Error('Invalid or missing image data in the response.');
        }

        // Decode the Base64 image data and save it to a file
        const decodedImageData = Buffer.from(firstImageData.b64_json, 'base64');

        // Construct the file path in the "temp" folder
        const output_fileName = req.body.fileName + '.png';
        const tempFolderPath = path.join('..', 'temp');
        const filePath = path.join(tempFolderPath, output_fileName);
        // Check if the "temp" folder exists, create it if not
        try {
            await fsp.access(tempFolderPath);
        } catch (error) {
            // "temp" folder doesn't exist, create it
            await fsp.mkdir(tempFolderPath);
        }
        console.log(filePath)
        await fsp.writeFile(filePath, decodedImageData);

        console.log('Output image saved to "output_image.png"');

        res.status(200).json({ message: 'Image processing successful' });
    } catch (error) {
        console.error(error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/alter-image', async (req, res) => {
    try {
        // Assuming the image data is sent in the request body
        const imageBuffer = Buffer.from(req.body.image, 'base64');

        // Save the received image to a file
        const input_fileName = req.body.fileName + '_input.png';
        await fsp.writeFile(input_fileName, imageBuffer);
        const file = await toFile(fs.createReadStream(input_fileName))

        // Alter the image using OpenAI API
        const image = await openai.images.createVariation({
            model: "dall-e-2",
            image: file,
            // prompt: "Convert the image to black and white by removing color information.",
            n: 1,
            size: "1024x1024",
            response_format: 'b64_json'
        })

        // Check if the image data is present in the response
        if (!image.data || !Array.isArray(image.data) || image.data.length === 0) {
            throw new Error('Invalid or missing image data in the response.');
        }

        // Assume the first element in the array contains the image data
        const firstImageData = image.data[0];

        // Check if the firstImageData has the expected property
        if (!firstImageData || typeof firstImageData.b64_json !== 'string') {
            throw new Error('Invalid or missing image data in the response.');
        }

        // Decode the Base64 image data and save it to a file
        const decodedImageData = Buffer.from(firstImageData.b64_json, 'base64');

        // Construct the file path in the "temp" folder
        const output_fileName = req.body.fileName + '.png';
        const tempFolderPath = path.join('..', 'temp');
        const filePath = path.join(tempFolderPath, output_fileName);
        // Check if the "temp" folder exists, create it if not
        try {
            await fsp.access(tempFolderPath);
        } catch (error) {
            // "temp" folder doesn't exist, create it
            await fsp.mkdir(tempFolderPath);
        }
        await fsp.writeFile(filePath, decodedImageData);

        const imagePath = input_fileName;

        // Delete the PNG image file
        fs.unlink(imagePath, (err) => {
            if (err) {
                console.error(`Error deleting file: ${err}`);
            } else {
                console.log(`File ${imagePath} has been deleted.`);
            }
        });

        console.log('Output image saved to "output_image.png"');

        res.status(200).json({ message: 'Image processing successful' });
    } catch (error) {
        console.error(error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

async function readAndEncodeImage() {
    try {
        // Read the image file asynchronously
        const imageBuffer = await fsp.readFile('image.png');

        // Encode the image data to Base64
        const base64ImageData = imageBuffer.toString('base64');

        console.log(base64ImageData);
    } catch (error) {
        console.error('Error reading or encoding the image:', error);
    }
}


app.listen(port, () => {
    // readAndEncodeImage();
    console.log(`Server is running at http://localhost:${port}`);
});
