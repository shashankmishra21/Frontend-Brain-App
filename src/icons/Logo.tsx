import  logo  from '../assets/logo.png';

export function Logo(){
    return (
        <img src={logo} alt="BrainBoard Logo" width={120} height="auto" style={{ objectFit: 'contain' }}/>
    )

}