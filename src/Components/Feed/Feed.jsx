import React, { useState, useEffect } from 'react';
import './Feed.css';
import { Link } from 'react-router-dom';
import { API_KEY, value_converter } from '../../data';
import moment from 'moment';


const Feed = ({ category }) => {
    const [data, setData] = useState([]);

    const fetchdata = async () => {
        const videolist_url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&chart=mostPopular&regionCode=US&videoCategoryId=${category}&key=${API_KEY}&maxResults=50`;
        await fetch(videolist_url)
            .then(response => response.json())
            .then(data => {
                console.log(data); // Log the entire API response
                setData(data.items);
            })
            .catch(error => console.error('Error fetching data:', error));
    };

    useEffect(() => {
        fetchdata();
    }, [category]);

    return (
        <div className='feed'>
            {data.map((item, index) => (
                <Link to={`video/${item.snippet.categoryId}/${item.id}`} className='card' key={index}>
                    <img src={item.snippet.thumbnails.medium.url} alt='' />
                    <h2>{item.snippet.title}</h2>
                    <h3>{item.snippet.channelTitle}</h3>
                    <p>{value_converter(item.statistics?.viewCount)} views &bull; {moment(item.snippet.publishedAt).fromNow()}</p>
                </Link>
            ))}
        </div>
    );
};

export default Feed;
