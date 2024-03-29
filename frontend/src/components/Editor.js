import React, { useEffect ,useRef} from 'react';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/dracula.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/edit/closebrackets.js';
import 'codemirror/addon/edit/closetag.js';
import CodeMirror from 'codemirror';
import ACTIONS from '../Actions';

const Editor = ({socketRef,roomId}) => {
  const editorRef = useRef(null);
  useEffect(() => {
    async function init() {
      editorRef.current =CodeMirror.fromTextArea(document.getElementById('realtimeEditor'), {
        mode: { name: 'javascript', json: true },
        theme: 'dracula',
        autoCloseTags: true,
        autoCloseBrackets: true,
        lineNumbers: true,
      });
      editorRef.current.on('change',(instance,changes)=>{
          console.log(changes);
          const {origin} = changes;
          const code = instance.getValue();
          if(origin !== 'setValue')
          {
            socketRef.current.emit(ACTIONS.CODE_CHANGE,{
              roomId,
              code,
            });
          }
      });
     
      
    }
    init();

  }, []);
  useEffect(()=>{
    if(socketRef.current)
    {
      socketRef.current.on(ACTIONS.CODE_CHANGE,({code})=>{
        if(code !== null)
        {
          editorRef.current.setValue(code);
        }
      });
    }
    return ()=>{
      if(socketRef.current){
       
      socketRef.current.off(ACTIONS.CODE_CHANGE);
      }
    }
   },[socketRef.current]);

  return (
    <div>
      <textarea id='realtimeEditor'></textarea>
    </div>
  );
};

export default Editor;
