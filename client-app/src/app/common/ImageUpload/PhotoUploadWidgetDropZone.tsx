import React, {useCallback} from 'react'
import {useDropzone} from 'react-dropzone'
import { Header, Icon } from 'semantic-ui-react'

interface props{
    setFiles: (files: any) => void
}

export default function PhotoUploadWidgetDropZone({setFiles}:props) {
    const dzStyle = {
        border: 'dashed 3px #eee',
        borderColor: '#eee',
        borderRadius: '5px',
        paddingTop: '30px',
        textAlign: 'center' as 'center',
        height: 200, 
    }

    const dzActive = {
        borderColor:'green'
    }

  const onDrop = useCallback(files => {
   setFiles(files.map((file:any) => 
   Object.assign(file, {
       preview: URL.createObjectURL(file)
   })))
  }, [setFiles])
  
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

  return (
    <div {...getRootProps()} style={isDragActive ? {...dzStyle,...dzActive} : dzStyle }>
      <input {...getInputProps()} />
     <Icon name='upload' size='huge' />
     <Header content='Drop Image Here' />
    </div>
  )
}
