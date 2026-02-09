const bucket = require('../config/firebase');

exports.uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send('No file uploaded.');
        }

        const fileName = `${Date.now()}-${req.file.originalname}`;
        const blob = bucket.file(fileName);
        
        const blobStream = blob.createWriteStream({
            metadata: {
                contentType: req.file.mimetype
            }
        });

        blobStream.on('error', (error) => {
            console.error(error);
            res.status(500).json({ message: 'Something went wrong during upload' });
        });

        blobStream.on('finish', async () => {
            await blob.makePublic();
            const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
            res.status(200).json({ filePath: publicUrl });
        });

        blobStream.end(req.file.buffer);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error during upload" });
    }
};