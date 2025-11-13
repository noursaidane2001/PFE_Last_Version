import React, { useEffect, useState } from 'react';
import '../Following/Following.css';
import { useParams } from 'react-router-dom';
import withScrollToTop from '../../withScrollToTop';
import { getUserFollowing, unFollow } from '../../../Services/UserService';

function Following() {
    const token = localStorage.getItem("token");
    console.log("token", token);
    const { userId } = useParams();
    const [followingList, setFollowingList] = useState([]);
    useEffect(() => {
        getUserFollowing(userId)
            .then((response) => {
                setFollowingList(response.following);
            });

    }, [userId]);
    console.log(followingList.length)
    console.log(followingList)

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
        <div className="userProfileF">
            <h1 className='followines'>Following List </h1>
            <div className='Flist'>
                {followingList.map((user) => (
                    <div className='cardUserF' key={user._id}>
                        <img src={`http://localhost:5000/uploads/user/${user.photo}`} alt="Photo de profil" />
                        <div className='card-info-userF'>
                            <div className='card-infoF'>
                                <div className='card-info-nameF'>{user.firstname}</div>
                                <div className='card-info-lastnameF'>{user.lastname}</div>
                            </div>
                            <div className='card-info-followF'>
                                <div className='card-info-nameF'>{user.followers.length} Followers</div>
                                <div className='card-info-lastnameF'>{user.following.length} Following</div>
                            </div>
                        </div>

                        <button className="subscribeButtonF" style={{
                            backgroundColor: '#161616',
                            borderColor: '#161616',
                            border: '0',
                            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.4)"
                        }} onClick={(e) => handleUnfollowClick(e, user._id)}>
                            Unfollow
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default withScrollToTop(Following);
