import React, { useEffect, useState } from 'react';
import './PlayVideo.css';
import like from '../../assets/like.png';
import dislike from '../../assets/dislike.png';
import share from '../../assets/share.png';
import save from '../../assets/save.png';
import user_profile from '../../assets/user_profile.jpg';
import { API_KEY } from '../../data';
import moment from 'moment';
import { useParams } from 'react-router-dom';

const PlayVideo = () => {
    const { videoId } = useParams(); // Only use videoId from useParams
    const [apiData, setApiData] = useState(null);
    const [channelData, setChannelData] = useState(null);
    const [commentData, setCommentData] = useState([]);

    const fetchVideoData = async () => {
        const videoDetails_url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoId}&key=${API_KEY}`;
        try {
            const response = await fetch(videoDetails_url);
            const data = await response.json();
            if (data.items && data.items.length > 0) {
                setApiData(data.items[0]); // Set video data
                fetchChannelData(data.items[0].snippet.channelId); // Fetch channel data after getting video data
            } else {
                console.error("No video data found.");
            }
        } catch (error) {
            console.error("Error fetching video data:", error);
        }
    };

    const fetchChannelData = async (channelId) => {
        const channelData_url = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelId}&key=${API_KEY}`;
        try {
            const response = await fetch(channelData_url);
            const data = await response.json();
            if (data.items && data.items.length > 0) {
                setChannelData(data.items[0]); // Set channel data
            } else {
                console.error("No channel data found.");
            }
        } catch (error) {
            console.error("Error fetching channel data:", error);
        }
    };

    const fetchCommentData = async () => {
        const comment_url = `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&key=${API_KEY}&maxResults=50`;
        try {
            const response = await fetch(comment_url);
            const data = await response.json();
            if (data.items) {
                setCommentData(data.items); // Set comments data
            }
        } catch (error) {
            console.error("Error fetching comments:", error);
        }
    };

    useEffect(() => {
        if (videoId) {
            fetchVideoData(); // Fetch video data when videoId is available
            fetchCommentData(); // Fetch comments whenever videoId changes
        }
    }, [videoId]);

    const value_converter = (value) => {
        if (!value) return "0";
        if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
        if (value >= 1e3) return `${(value / 1e3).toFixed(1)}K`;
        return value.toString();
    };

    return (
        <div className='play-video'>
            {apiData && (
                <iframe 
                    width="640" 
                    height="360" 
                    src={`https://www.youtube.com/embed/${videoId}?autoplay=1`} 
                    title="Video Player" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                    referrerPolicy="strict-origin-when-cross-origin" 
                    allowFullScreen
                ></iframe>
            )}
            <h3>{apiData ? apiData.snippet.title : "Title Here"}</h3>
            <div className='play-video-info'>
                <p>
                    {apiData 
                        ? `${value_converter(apiData.statistics.viewCount)} Views` 
                        : "16K Views"} 
                    &bull; 
                    {apiData 
                        ? moment(apiData.snippet.publishedAt).fromNow() 
                        : ""}
                </p>
                <div>
                    <span><img src={like} alt="" />{apiData ? apiData.statistics.likeCount : 155}</span>
                    <span><img src={dislike} alt="" />{apiData ? apiData.statistics.dislikeCount : 25}</span>
                    <span><img src={share} alt="" />share</span>
                    <span><img src={save} alt="" />save</span>
                </div>
            </div>
            <hr />
            <div className='publisher'>
                {channelData && channelData.snippet.thumbnails ? (
                    <img src={channelData.snippet.thumbnails.default.url} alt='' />
                ) : (
                    <img src={user_profile} alt="" />
                )}
                <div>
                    <p>{channelData ? channelData.snippet.title : "Channel Title"}</p>
                    <span>{channelData ? `${value_converter(channelData.statistics.subscriberCount)} Subscribers` : "1M Subscribers"}</span>
                </div>
                <button>Subscribe</button>
            </div>
            <div className='vid-description'>
                <p>{apiData ? apiData.snippet.description.slice(0, 250) : "Description Here"}</p>
                <hr />
                <h4>{apiData ? apiData.statistics.commentCount : 102} Comments</h4>
                {commentData.map((item, index) => (
                    <div key={index} className='comment'>
                        <img src={item.snippet.topLevelComment.snippet.authorProfileImageUrl} alt="" />
                        <div>
                            <h3>{item.snippet.topLevelComment.snippet.authorDisplayName}<span> 1 day ago</span></h3>
                            <p>{item.snippet.topLevelComment.snippet.textDisplay}</p>
                            <div className='comment-action'>
                                <img src={like} alt="" />
                                <span>{value_converter(item.snippet.topLevelComment.snippet.likeCount)}</span>
                                <img src={dislike} alt="" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PlayVideo;

