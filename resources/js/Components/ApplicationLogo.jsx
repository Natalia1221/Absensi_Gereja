export default function ApplicationLogo(props) {
    return (
        <img 
            {...props} 
            src="/favicon.png" 
            alt="Logo Aplikasi" 
            className={`h-20 w-auto object-contain ${props.className || ''}`} 
        />
    );
}
