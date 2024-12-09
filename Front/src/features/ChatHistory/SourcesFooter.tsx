import React from "react";
import { ISource } from "../../interfaces/IConversation";

function SourcesFooter({sources} : {sources : ISource[]}){
    return(
        <>
            <hr style={{opacity:0.3, margin:'0.95rem 0 0.75rem 0'}}/>
            <span style={{fontSize:'14px', fontWeight:600, textDecoration:'underline', marginBottom:'0.25rem'}} >Sources :</span>
            {sources.map(source => (<span className="source"><a href={source.asMarkdown}>{source.asMarkdown}</a></span>))}
        </>
    )
}

export default React.memo(SourcesFooter, (prevProps, nextProps) => {
    return JSON.stringify(prevProps.sources) === JSON.stringify(nextProps.sources);
})