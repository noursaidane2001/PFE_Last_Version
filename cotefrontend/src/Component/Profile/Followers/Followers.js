import React, { useEffect, useState } from 'react';
import '../Followers/Followers.css';
import { useParams } from 'react-router-dom';
import withScrollToTop from '../../withScrollToTop';
import { Follow, unFollow, getUser } from '../../../Services/UserService';

function Followers() {
    const token = localStorage.getItem("token");
    console.log("token", token);
    const { userId } = useParams();
    const [followingList, setFollowingList] = useState([]);
    const [followersList, setFollowersList] = useState([]);

    useEffect(() => {
        getUser(userId)
            .then((response) => {
                setFollowersList(response.followers);
                setFollowingList(response.following);

            });
    }, [userId]);
    console.log(followersList)
    console.log(followingList)
    const handleFollowClick = (e, id) => {
        e.preventDefault();
        Follow(id, token)
            .then((response) => {
                console.log("res", response);
                window.location.reload();
            })
            .catch((error) => {
                console.error("err", error);
            });
    };

    const handleUnfollowClick = (e, id) => {
        e.preventDefault();
        unFollow(id, token)
            .then((response) => {
                console.log("res", response);
                window.location.reload();
            })
            .catch((error) => {
                console.error("err", error);
            });
    }
    return (
        <div className="userProfileFo">
            <h1 className='followeres'>Followers List </h1>
            <div className='Folist'>
                {followersList.map((user) => (
                    <div className='cardUserFo' key={user._id}>
                        <img src={`http://localhost:5000/uploads/user/${user.photo}`} alt="Photo de profil" />
                        <div className='card-info-userFo'>
                            <div className='card-infoFo'>
                                <div className='card-info-nameFo'>{user.firstname}</div>
                                <div className='card-info-lastnameFo'>{user.lastname}</div>
                            </div>
                            <div className='card-info-followFo'>
                                <div className='card-info-nameFo'>{user.followers.length} Followers</div>
                                <div className='card-info-lastnameFo'>{user.following.length} Following</div>
                            </div>
                        </div>
                        {followingList.some((item) => item._id.includes(user._id)) === false && (
                            <button className="subscribeButtonFo" style={{
                                backgroundColor: '#343beb',
                                borderColor: '#343beb',
                                border: '0',
                                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.4)"
                            }} onClick={(e) => handleFollowClick(e, user._id)}>
                                Follow back
                            </button>
                        )}

                        {followingList.some((item) => item._id.includes(user._id)) === true && (
                            <button className="subscribeButtonFo" style={{
                                backgroundColor: '#161616',
                                borderColor: '#161616',
                                border: '0',
                                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.4)"
                            }} onClick={(e) => handleUnfollowClick(e, user._id)}>
                                Unfollow
                            </button>
                        )}

                    </div>
                ))}
            </div>
        </div>
    );
}

export default withScrollToTop(Followers);
