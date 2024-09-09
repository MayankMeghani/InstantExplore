import React,{useState,useEffect} from "react";
import {getUserReviews} from "../services/userServices"; 
const ReviewList =  ()=>{
    const [user,setUser]=useState(null);
    const [reviews,setReviews]=useState([]);

    useEffect(()=>{
        user = JSON.parse(sessionStorage.getItem('user'));
        setUser(
          {
            _id:user._id,
            name:user.name,
            email:user.email,
            role:(user.isAdmin)?"Admin":"User"
          }
        );
        fetchReviews(user._id);
    },[]);

    const fetchReviews = async (id)=>{
        const data = getUserReviews(id); ;
        setReviews(data);
    }

    return( 
        <>
        { 
        reviews.map((review,index) => {

        })
        }
        </>
    );
}

export default ReviewList;