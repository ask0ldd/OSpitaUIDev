import { useRef } from "react";

function CodeBlock({ code, language } : IProps) {
    const codeRef = useRef(null);
  
    /*useEffect(() => {
      hljs.highlightElement(codeRef.current);
    }, [code]);*/
  
    return (
      <pre>
        <code ref={codeRef} className={language}>
          {code}
        </code>
      </pre>
    );
  };

  export default CodeBlock

  interface IProps{
    code : string
    language : string
  }