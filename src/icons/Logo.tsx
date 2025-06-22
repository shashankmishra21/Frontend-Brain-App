import  logo from '../assets/logo.png';

export function Logo(){
    return (
        <img src={logo} alt="BrainBoard Logo" width={180} height="auto" style={{ objectFit: 'contain' }}/>
    )

}