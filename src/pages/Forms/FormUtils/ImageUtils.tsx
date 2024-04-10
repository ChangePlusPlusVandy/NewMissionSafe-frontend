export const isImageFile = (value: any) => {
    if (value) {
        const file = value as File
        const validFileExtensions = ['jpg', 'gif', 'png', 'jpeg', 'svg', 'webp'];
        const fileEnd = file.name.split('.').pop() || ""
        return file && file.name.length > 0 && validFileExtensions.includes(fileEnd.toLowerCase())
    }
    return true;
}

export const allowedFileMessage = 'The following file types are allowed: jpg, gif, png, jpeg, svg, webp'