import Editor from '@monaco-editor/react';
import { Heading, Box, Button, Card } from 'grommet';
import { Add, Close, Subtract } from 'grommet-icons';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { closeEditor } from '../store/slice/settingSlice'
import { fetchCodeFromGitHub } from '../services/getCodeFromGithub';

const extensionToLanguageMap = {
    js: 'javascript',
    ts: 'typescript',
    jsx: 'javascript',
    tsx: 'typescript',
    html: 'html',
    css: 'css',
    json: 'json',
    md: 'markdown',
    py: 'python',
    java: 'java',
    cpp: 'cpp',
    c: 'c',
    cs: 'csharp',
    rb: 'ruby',
    php: 'php',
    rs: 'rust',
    go: 'go',
    mdx: 'markdown',
    sh: 'shell',
    // Add more mappings as needed
};

const getLanguageByExtension = (filename) => {
    const extension = filename.split('.').pop();
    return extensionToLanguageMap[extension] || 'plaintext';
};
  
export const CodeEditor = () => {
    const dispatch = useDispatch();

    // console.log('.... CodeEditor.js is callled')
    const githubSelectedFile = useSelector((state) => state.githubFile);
    const githubDetail = useSelector((state) => state.githubDetail)

    const [font, setFont] = useState(16);
    const [code, setCode] = useState(``);
    const [language, setLanguage] = useState('typescript'); // Default language
    const filename = githubSelectedFile.file;

    useEffect(() => {
        const fetchCodeAndDetectLanguage = async () => {
            try {
                const response = await fetchCodeFromGitHub(githubDetail.owner, githubDetail.repo, githubSelectedFile.file);
                setCode(code => `${response}`)
                const detectedLanguage = getLanguageByExtension(githubSelectedFile.file);
                setLanguage(detectedLanguage);
                // console.log(githubSelectedFile.file, detectedLanguage)
                // setLanguage(detectedLanguage || 'plaintext'); // Set to plaintext if detection fails
                // console.log(detectedLanguage, language); // Handle the detected language here
            } catch (error) {
                console.error('Error fetching code:', error);
            }
        };

        // if (githubSelectedFile.file) {
        fetchCodeAndDetectLanguage();
        // }
    }, [githubSelectedFile.file]);

    const editorDidMount = (editor) => {
        editor.focus();
    };

    const onChange = (newValue, e) => {
        // Handle editor change if needed
    };

    const fontChange = (option) => {
        if (option === '-') {
            setFont((prevFont) => prevFont - 1);
        } else {
            setFont((prevFont) => prevFont + 1);
        }
    };

    const onClickSplit = () => {
        dispatch(closeEditor());
    };


    return (
        <div >
            <Box align="center" gap='small' direction='row' justify='between'>
                <Heading level="4" margin="small">{filename === '' ? 'Your\'s Space' : filename}</Heading>
                <Button margin='small' onClick={onClickSplit}><Close /></Button>
            </Box>

            <Card style={{ position: 'absolute', bottom: '5%', right: '2%', zIndex: 10, backgroundColor: 'white' }} direction='row' gap='medium' pad='small'>
                <Add onClick={() => fontChange('+')} size='small' margin="small" />
                <Subtract onClick={() => fontChange('-')} size='small' />
            </Card>

            <div className='pt-1'>
                <Editor
                    height="100vh"
                    language={language} // Default language, you'll update this based on the detected language
                    theme="vs-light"
                    onChange={onChange}
                    value={code}
                    options={{
                        fontSize: font
                    }}
                    editorDidMount={editorDidMount}
                />
            </div>
        </div>
    );
};
