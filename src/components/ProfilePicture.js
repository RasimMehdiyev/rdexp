import React, { useState } from 'react';
import { supabase } from '../lib/helper/supabaseClient';

const ProfilePicture = ({ teamId }) => {
    // State for the current image URL and for file selection
    const [imageUrl, setImageUrl] = useState('https://neeixstjxyxdbquebgkc.supabase.co/storage/v1/object/sign/profile-pictures/teams/u21.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwcm9maWxlLXBpY3R1cmVzL3RlYW1zL3UyMS5wbmciLCJpYXQiOjE3MDEzODUxNTAsImV4cCI6MTcwMTk4OTk1MH0.IvgqQNouCQvpjL0cTp-19aX4fFrw4vvc6rY92lM2ZEA&t=2023-11-30T22%3A59%3A10.544Z');
    const [file, setFile] = useState(null);

    // Handler for file selection
    const handleFileChange = (e) => {
        console.log("File selected:", e.target.files[0]);
        const uploadedFile = e.target.files[0];
        if (uploadedFile) {
            setFile(uploadedFile);

            // Generate a temporary URL to display the selected file
            const fileUrl = URL.createObjectURL(uploadedFile);
            setImageUrl(fileUrl);
        }
    };

    // Handler for file upload
    const handleUpload = async () => {
        console.log("Upload button clicked");
        if (file) {
            const fileExt = file.name.split('.').pop();
            const fileName = `teams/${teamId}/${Math.random()}.${fileExt}`;
    
            let { error: uploadError } = await supabase.storage
                .from('profile-pictures')
                .upload(fileName, file);
    
            if (uploadError) {
                console.error('Error uploading file:', uploadError);
                return;
            }
    
            // Get public URL for the uploaded image
            let { publicURL, error: urlError } = supabase.storage
                .from('profile-pictures')
                .getPublicUrl(fileName);
    
            if (urlError) {
                console.error('Error getting public URL:', urlError);
                return;
            }
    
            // Update the team record in the database
            let { error: dbError } = await supabase
                .from('team')
                .update({ picture: publicURL })
                .match({ id: teamId });
    
            if (dbError) {
                console.error('Error updating team record:', dbError);
            } else {
                setImageUrl(publicURL);
            }
        }
    };

    return (
        <div>
            <img 
                className="w-[142px] h-[142px] rounded-[100px] border-4 border-white" 
                src={imageUrl} 
                alt="Profile" 
            />
            <input 
                type="file" 
                onChange={handleFileChange} 
            />
            <button onClick={handleUpload}>Upload</button>
        </div>
    );
};

export default ProfilePicture;
