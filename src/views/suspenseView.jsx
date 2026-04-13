
export function SuspenseView(props) { 
    if(!props.promise){
        return <span>no data</span>;
    }
    if(props.error){
        return <span>{props.error.toString()}</span>;
    }

    return (
        <img src="https://brfenergi.se/iprog/loading.gif" />
    );}