import React, { useState, useEffect } from 'react';
import withScrollToTop from '../withScrollToTop';
import { useParams } from 'react-router-dom';
import '../Searchuser/Searchuser.css';
import { Grid } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { getUser, getUserFollowing, getUserFollowers } from '../../Services/UserService';
import { Follow, unFollow } from '../../Services/UserService';

function Searchuser() {
  //serched userid
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get('user');

  //connected userid
  const token = localStorage.getItem("token");
  console.log("token", token);
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user._id;
  console.log(userId)
  const [data, setData] = useState([]);
  const [follow, setFollow] = useState(false);
  const [unfollow, setUnfollow] = useState(false);
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);
  const [followme, setFollowMe] = useState(false);
  const [followyou, setFollowYou] = useState(false);
  //user searched
  useEffect(() => {
    getUser(id)
      .then((response) => {
        console.log(response)
        setData(response);

      });
    getUserFollowing(id)
      .then((response) => {
        setFollowing(response.count);
      });

    getUserFollowers(id)
      .then((response) => {
        setFollowers(response.count);
      });

  }, [id]);
  //usser connected
  useEffect(() => {
    getUserFollowing(userId)
      .then((response) => {
        setFollowYou(response.following.some((item) => item._id.includes(id)));

      });

    getUserFollowers(userId)
      .then((response) => {
        setFollowMe(response.followers.some((item) => item._id.includes(id)));

      });

  }, [userId]);
  console.log(followyou);
  console.log(followme);


  useEffect(() => {
    if (follow) {
      Follow(id, token)
        .then((response) => {
          console.log("res", response);
          window.location.reload();
        })
        .catch((error) => {
          console.error("err", error);
        });
    } else if (unfollow) {
      unFollow(id, token)
        .then((response) => {
          console.log("res", response);
          window.location.reload();

        })
        .catch((error) => {
          console.error("err", error);
        });
    }
  });

  const handleFollowClick = (e) => {
    e.preventDefault();
    setFollow(true);
  };
  const handleUnfollowClick = (e) => {
    e.preventDefault();
    setUnfollow(true)

  };
  console.log(follow)
  console.log(unfollow)
  return (
    <Grid container direction="row" className="profiles">
      <div className='userProfile'>
        {data && (
          <div className='cardUser'>
            <img src={`http://localhost:5000/uploads/user/${data.photo}`} alt="Photo de profil" />
            <div className='card-info-user'>
              <div className='card-info'>
                <div className='card-info-name'>{data.firstname}</div>
                <div className='card-info-lastname'>{data.lastname}</div>
              </div>
              <div className='card-info-follow'>
                <div className='card-info-name'>{followers} Followers</div>
                <div className='card-info-lastname'>{following} Following</div>
              </div>
            </div>
            {followme === true && followyou === false && (
              <button className="subscribeButton" style={{
                backgroundColor: '#343beb',
                borderColor: '#343beb',
                border: '0',
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.4)"
              }} onClick={handleFollowClick}>
                Follow back
              </button>
            )}
            {followme === true && followyou === true && (
              <button className="subscribeButton" style={{
                backgroundColor: '#161616',
                borderColor: '#161616',
                border: '0',
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.4)"
              }} onClick={handleUnfollowClick}>
                Unfollow
              </button>
            )}
            {followme === false && followyou === false && (
              <button className="subscribeButton" style={{
                backgroundColor: '#343beb',
                borderColor: '#343beb',
                border: '0',
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.4)"
              }} onClick={handleFollowClick}>
                Follow
              </button>
            )}
            {followme === false && followyou === true && (
              <button className="subscribeButton" style={{
                backgroundColor: '#161616',
                borderColor: '#161616',
                border: '0',
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.4)"
              }} onClick={handleUnfollowClick}>
                Unfollow
              </button>
            )}
          </div>
        )}
      </div>
    </Grid>
  );

}
export default withScrollToTop(Searchuser);
