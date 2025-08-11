const express = require("express");
const axios = require("axios");
const router = express.Router();

router.post('/', async (req, res) => {
    const {text} = req.body;
    console.log(text);


    try {
        const response = await axios.post(
            // "https://router.huggingface.co/hf-inference/models/distilbert/distilbert-base-uncased",
            // "https://api-inference.huggingface.co/models/distilbert-base-uncased-finetuned-sst-2-english",
            // "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
            'https://router.huggingface.co/hf-inference/models/tabularisai/multilingual-sentiment-analysis',
            {inputs:text},
            {
                headers:{
                    Authorization:`Bearer ${process.env.HF_TOKEN}`
                }
            }
        );
        console.log("heelo after response");
        let dataRes=response.data;
        let b=dataRes.flat();

        console.log(b);
        

        // console.log(response);
        // console.log(JSON.stringify(response.data, null, 2));
        
        // res.json(JSON.stringify(response.data, null, 2));
        res.json({result:response.data})

    } catch(e) {
        console.log("error",e);
        
        res.status(500).json({error:'failed'});
    }
})

module.exports=router ;