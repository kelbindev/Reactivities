import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react'
import { Button, Grid, Header } from 'semantic-ui-react'
import PhotoUploadWidgetDropZone from './PhotoUploadWidgetDropZone'
import PhotoUplaodCropper from './PhotoUploadCropper'

interface props{
    uploadPhotoHandler: (file:Blob) => void;
    uploading: boolean
}

export default function PhotoUploadWidget({uploadPhotoHandler, uploading}:props) {
    const [files, setFiles] = useState<any>([]);
    const [cropper, setCropper] = useState<Cropper>();

    function onCrop() {
        if (cropper) {
            cropper.getCroppedCanvas().toBlob(blob => uploadPhotoHandler(blob!))
        }
    }

    useEffect(() => {
        return () => {
            files.forEach((file: any) => URL.revokeObjectURL(file.preview));
        }
    }, [files])

    return (
        <Grid>
            <Grid.Column width={4}>
                <Header sub color='teal' content='step 1 - Add Photo' />
                <PhotoUploadWidgetDropZone setFiles={setFiles} />
            </Grid.Column>
            <Grid.Column width={1} />
            <Grid.Column width={4}>
                <Header sub color='teal' content='step 2 - Resize Image' />
                {files && files.length > 0 && (
                    <PhotoUplaodCropper setCropper={setCropper} imagePreview={files[0].preview} />
                )}
            </Grid.Column>
            <Grid.Column width={1} />
            <Grid.Column width={4}>
                <Header sub color='teal' content='step 1 - Preview and Upload' />
                {files && files.length > 0 && (
                    <>
                        <div className='img-preview' style={{ minHeight: 200, overflow: 'hidden' }} />
                        <Button.Group>
                            <Button loading={uploading} disabled={uploading} onClick={onCrop} positive icon='check' />
                            <Button disabled={uploading} onClick={() => setFiles([])} icon='close' />
                        </Button.Group>
                    </>
                )}
            </Grid.Column>
        </Grid>
    )
}