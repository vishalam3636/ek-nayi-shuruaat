import React, { useState, useEffect } from 'react';
import axios from 'axios';

import {
    Form,
    TextArea,
    Button,
    Icon
} from 'semantic-ui-react';

export default function Translate() {
    const [inputText, setInputText] = useState("");
    const [detectedLanguageKey, setDetectedLanguageKey] = useState("");
    const [languagesList, setLanguagesList] = useState([]);
    const [selectedLanguageKey, setSelectedLanguageKey] = useState('');
    const [translatedText, setTranslatedText] = useState("")

    useEffect(() => {
        axios.get("https://libretranslate.de/languages",
        {
            headers:{
                "accept": "application/json"
            }
        })
        .then(res => {
            console.log(res, "resss from languagess list api")
            setLanguagesList(res?.data)
        })

        detectLanguage()
    }, [inputText])

    const detectLanguage = () => {
        axios.post("https://libretranslate.de/detect",
            {
                q: inputText
            },
            {
                headers: {
                    "accept": "application/json",
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            },
        )
        .then(res => {
            console.log(res?.data[0]?.language, "resss from detect api")
            setDetectedLanguageKey(res.data[0].language)
            return res.data[0].language
        })
    }

    const handleSelect =(e)=> {
        console.log(e.target.value)
        setSelectedLanguageKey(e.target.value)
    }

    const translateText = () => {
        detectLanguage()

        let data = {
            q : inputText,
            source: detectedLanguageKey,
            target: selectedLanguageKey
        }

        axios.post("https://libretranslate.de/translate", data,
        {
            headers:{
                "accept": "application/json",
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }
        ).then(res => {
            console.log(res, "resss after translatingg")
            setTranslatedText(res?.data?.translatedText)
        })
        
    }

    console.log(inputText, "inputtt text")
    console.log(detectedLanguageKey, "detectedd language")
    console.log(languagesList, "languagesss lisst")
    console.log(selectedLanguageKey, "selectedttt language key")
    console.log(translatedText, "translated textttt")
    return (
        <div>
            <div className="app-header">
                <h2 className="header">Texty Translator</h2>
            </div>

            <div className='app-body'>
                <div>
                    <Form>
                        <Form.Field
                            control={TextArea}
                            placeholder='Type Text to Translate..'
                            onChange={(e) => setInputText(e.target.value)}
                        />
                        <select className="language-select" onChange={handleSelect}>
                            <option>Please Select Language..</option>
                            {
                                languagesList?.map((lang, ind)=> {
                                    return <option value={lang?.code}>{lang?.name}</option>
                                })
                            }
                        </select>

                        <Form.Field
                            control={TextArea}
                            placeholder='Your Result Translation..'
                            value={translatedText}
                        />

                        <Button
                            color="orange"
                            size="large"
                            onClick={translateText}
                        >
                            <Icon name='translate' />
                            Translate</Button>
                    </Form>
                </div>
            </div>
        </div>
    )
}

// translate.js file
