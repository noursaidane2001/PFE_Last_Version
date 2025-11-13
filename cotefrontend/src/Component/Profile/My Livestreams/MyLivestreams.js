import React, { useState, useEffect } from 'react';
import YouTube from 'react-youtube';
import { useNavigate } from 'react-router-dom';
import withScrollToTop from '../../withScrollToTop';
import { useParams } from 'react-router-dom';
import '../My Livestreams/MyLivestreams.css'
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { FinishLive, getuserLive } from '../../../Services/LiveService';

function MyLivestreams() {
    const token = localStorage.getItem("token");
    console.log("token", token);
    const [live, setLive] = useState([]);
    const navigate = useNavigate();
    const { userId } = useParams();


    useEffect(() => {
        getuserLive(userId)
            .then((response) => {
                setLive(response);
                console.log(response);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);
    console.log(live)

    const handleFinish = (itemId) => {
        Swal.fire({
            title: 'Confirmation',
            text: 'Are you sure to finish Live?',
            showCancelButton: true,
            confirmButtonColor: 'red',
            cancelButtonColor: 'gray',
            confirmButtonText: 'Finish',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                console.log('Finish');
                FinishLive(itemId)
                    .then((response) => {
                        console.log("live finito", response);
                        window.location.reload();

                    })
                    .catch((error) => {
                        console.log(error);
                    });
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                console.log('cancel');
            }
        });
    };


    return (
        <div>
            <h1 className='livestream'> My Livestreams </h1>
            <div className='myliveslist'>
                {live.map(item => (
                    <div className='livebox' key={item._id} >
                        <YouTube
                            videoId={item.youtubelink}
                            opts={{
                                width: '100%',
                                height: '95%',
                                playerVars: {
                                    autoplay: 0
                                }
                            }}
                        />
                        <Link className='youtubelinkes' to={`/live/${item._id}`}>
                            <div className='livetitlees'>{item.title}</div>
                            <div className='created-at-livees'>
                                <> Created at  </>
                                {new Date(item.created_At).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                {item.Date}
                            </div>
                        </Link>
                        {item.islive ? (
                            <button type='submit' className='btnFin' onClick={() => handleFinish(item._id)}>Finish</button>
                        ) : (
                            <button type='submit' className='btnFinDisabled' disabled>Finished</button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default withScrollToTop(MyLivestreams);
