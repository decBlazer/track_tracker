import React, { useEffect, useState } from 'react';
import axios from 'axios';

const RandomSongs = () => {
    const [songs, setSongs] = useState([]);

    useEffect(() => {
        axios.get('https://localhost:8443/random-songs')
            .then(response => {
                setSongs(response.data.items);
            })
            .catch(error => console.error('Error fetching data: ', error));
    }, []);

    return (
        <div>
            <h1>Random Songs</h1>
            <ul>
                {songs.map((song, index) => (
                    <li key={index}>
                        {song.track.name} by {song.track.artists.map(artist => artist.name).join(', ')}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default RandomSongs;
