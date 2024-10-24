import React, { useState, useEffect, useCallback } from "react";
import { getUserRequests } from "../services/userServices";  
import Search from "../components/Search";
import { useUser } from '../hooks/userContext';
import RequestCard from "../components/RequestCard";
import { getRequests, updateRequest, removeRequest } from "../services/requestServices";
import CircularProgress from '@mui/material/CircularProgress';
import { useSnackbar } from "../hooks/snackbarContext";  
import ConfirmationModal from "../components/ConfirmationModal"; // Import the modal
import './Styles/RequestList.css';

const RequestList = () => {
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null); 
  const { user } = useUser();
  const { showSnackbar } = useSnackbar(); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [requestToRemove, setRequestToRemove] = useState(null); // State to hold the request to remove

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
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user, fetchData]);
  
  const handleUpdateRequest = async (request, updatedStatus) => {
    try {
      setLoading(true);
      await updateRequest(request._id, { status: updatedStatus }, user.token);
      setRequests((prevRequests) =>
        prevRequests.map((req) => (req._id === request._id ? { ...req, status: updatedStatus } : req))
      );
      showSnackbar('Request updated successfully!');
    } catch (error) {
      console.error(error);
      setError('Error updating request. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveRequest = (requestId) => {
    setRequestToRemove(requestId); // Set the request ID to be removed
    setIsModalOpen(true); // Open the confirmation modal
  };

  const confirmRemoveRequest = async () => {
    if (requestToRemove) {
      try {
        setLoading(true);
        await removeRequest(requestToRemove, user.token);
        setRequests(requests.filter(request => request._id !== requestToRemove));
        showSnackbar('Request removed successfully!');
      } catch (error) {
        console.error(error);
        setError('Error removing request. Please try again later.');
      } finally {
        setLoading(false);
        setIsModalOpen(false); // Close the modal
        setRequestToRemove(null); // Clear the request to remove
      }
    }
  };

  const cancelRemoveRequest = () => {
    setIsModalOpen(false); // Close the modal without removing
    setRequestToRemove(null); // Clear the request to remove
  };

  const handleSearch = (query) => setSearchQuery(query);

  const filteredRequests = requests.filter(request =>
    request.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    request.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          ))
        ) : (
          <div className="no-requests">No requests found. Try adding new requests.</div>
        )}
      </div>

      {isModalOpen && (
        <ConfirmationModal 
          message="Are you sure you want to remove this request?"
          onConfirm={confirmRemoveRequest}
          onCancel={cancelRemoveRequest}
        />
      )}
    </div>
  );
};

export default RequestList;
