export const formatBase64Image = (base64String?: string): string => {
  if (!base64String || typeof base64String !== 'string' || base64String.trim() === '') {
    return "invalid_image_data"; 
  }

  if (/^data:image\/[a-zA-Z]+;base64,/.test(base64String)) {
    return base64String;
  }

  const cleanedBase64 = base64String.replace(/^data:image\/[a-zA-Z]+;base64,/, '').trim();

  let imageType = 'png'; 
  if (cleanedBase64.startsWith('/9j/')) {
    imageType = 'jpeg';
  } else if (cleanedBase64.startsWith('iVBOR')) {
    imageType = 'png';
  } else if (cleanedBase64.startsWith('R0lGOD')) {
    imageType = 'gif';
  } else if (cleanedBase64.startsWith('data:image/svg+xml')) { 
      return base64String; 
  }
  
  if (!/^[A-Za-z0-9+/=]+$/.test(cleanedBase64) || cleanedBase64.length % 4 !== 0) {
      return "invalid_image_data";
  }
    
  return `data:image/${imageType};base64,${cleanedBase64}`;
}; 