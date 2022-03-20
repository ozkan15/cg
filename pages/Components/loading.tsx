import { Fragment } from "react";
/*
displays loading icon on api requests
*/
const Loading = () => {
    return <div id="spinner-container">
        <img id="spinner" src="/Spinner.jpg" />
        <div>Loading...</div>
    </div>;
};

export default Loading;