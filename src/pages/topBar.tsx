import { Box, Button, Text, Image } from "grommet"
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { changeNote } from '../store/slice/settingSlice'
import mainLogo from '../assets/mainIcon.png';
import payment from '../assets/payment.jpeg';

import { useNavigate } from "react-router-dom";

const SideBar = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [hoveredButton, setHoveredButton] = useState('null');
    const state = useSelector((state: any) => state.settings);
    const splitState = state.code || state.note

    const openNotes = () => {
        dispatch(changeNote(false))
    }
    const aboutPage = () => {
        window.open('/', '_blank');
    }

    return (
        <div style={{ position: 'relative', zIndex: 1 }}>
            {/* Your component content */}
            <Image onClick={aboutPage} style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 2, backgroundColor:'white', pointerEvents:'auto' }} src={mainLogo} width="30px" height="30px" />

            {/* <Button style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 2, backgroundColor:'white' }} icon={<Github size="35" />} /> */}
            <Box style={{ position: 'absolute', top: '25px', right: '25px', zIndex: 2, }} direction="row" gap="medium">
                <Button style={{ visibility: splitState ? 'hidden' : 'visible' }} onClick={openNotes} onMouseEnter={() => setHoveredButton('Notes')} onMouseLeave={() => setHoveredButton('null')}>
                    <Text weight='bold' color={hoveredButton === 'Notes' ? '#444' : '#666e78'} >Notes</Text>
                </Button>
                <Button style={{ visibility: splitState ? 'hidden' : 'visible' }} onMouseEnter={() => setHoveredButton('Sponsor')} onMouseLeave={() => setHoveredButton('null')}>
                    <Text weight='bold' color={hoveredButton === 'Sponsor' ? '#444' : '#666e78'} >Sponsor</Text>
                </Button>
                {/* <Button ><Text weight='bolder' color='#666e78' >About</Text></Button> */}
            </Box>
{
    hoveredButton === 'Sponsor' && (   
        <Image src={payment} style={{ position: 'absolute', top: '60px', right: '1px', zIndex: 2,  }} width={ window.screen.width * 0.23 } height={window.screen.height * 0.4}/>                 
    )
}
                
        </div>

    )
}


export default SideBar;