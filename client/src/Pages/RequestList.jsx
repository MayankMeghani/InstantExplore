import React, { useState, useEffect,useCallback } from "react";
import { getUserRequests } from "../services/userServices";  
import Search from "../components/Search";
import { useUser } from '../hooks/userContext';
import "./Styles/RequestList.css";
import RequestCard from "../components/RequestCard";
import { getRequests, updateRequest, removeRequest } from "../services/requestServices";
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';

const RequestList = () => {
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null); 
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const { user } = useUser();


  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
       let data;
    if (user.isAdmin) {
      data = await getRequests();
    } else {
      data = await getUserRequests(user._id);
    }
    setRequests(data);
    } catch (error) {
      console.error(error);
      setError('Error fetching requests. Please try again later.');
    } finally {
      setLoading(false);
    }
  },[user]);

  useEffect(() => {

    if (user) {
      fetchData();
    }
  }, [user,fetchData]);
  

  
  const handleUpdateRequest = async (request, updatedStatus) => {
    try {
      setLoading(true);
      await updateRequest(request._id, { status: updatedStatus }, user.token);
      setRequests((prevRequests) =>
        prevRequests.map((req) => (req._id === request._id ? { ...req, status: updatedStatus } : req))
      );
      setSnackbarOpen(true); // Show success message
    } catch (error) {
      console.error(error);
      setError('Error updating request. Please try again later.');
    } finally {
      setLoading(false);
    }
  }

  const handleRemoveRequest = async (requestId) => {
    try {
      setLoading(true);
      await removeRequest(requestId, user.token);
      setRequests(requests.filter(request => request._id !== requestId));
      setSnackbarOpen(true); // Show success message
    } catch (error) {
      console.error(error);
      setError('Error removing request. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => setSearchQuery(query);

  const filteredRequests = requests.filter(request =>
    request.name.toLowerCase().includes(searchQuery.toLowerCase())
    || request.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  if (loading) return <div className='loader'><CircularProgress /></div>;
  if (error) return <div className="error-message">{error}</div>; 

  return (
    <div className="list-container">
       <Search onSearch={handleSearch} />
       <div className="request-list">
       {filteredRequests.length > 0 ? (
          filteredRequests.map((request) => (
            <RequestCard
              key={request._id}
              request={request}
              onUpdateRequest={handleUpdateRequest}
              onRemoveRequest={handleRemoveRequest}
            />
          ))) : (
            <div className="no-requests">No requests found. Try adding new requests.</div>
          )}
       </div>
       <Snackbar
         open={snackbarOpen}
         onClose={handleCloseSnackbar}
         message="Operation successful!"
         autoHideDuration={3000}
       />
    </div>
  );
};

export default RequestList;
