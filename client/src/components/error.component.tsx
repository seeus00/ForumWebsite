import { useLocation } from "react-router-dom";

import './error.css';

export default function Error() {
    const location = useLocation();
    return (<div>
        <span>{location.state.errorMsg}</span>
    </div>)
}