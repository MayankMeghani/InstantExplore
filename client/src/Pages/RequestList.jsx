import React, { useState, useEffect } from "react";
import { getUserRequests } from "../services/userServices";  
import Search from "../components/Search";
import { useUser } from '../hooks/userContext';
import "./Styles/RequestList.css";
import RequestCard from "../components/RequestCard";
import { getRequests,updateRequest, removeRequest } from "../services/requestServices";

const RequestList = () => {
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null); 
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      await fetchRequests(user._id, user.token);
    } catch (error) {
      setError('Error fetching requests. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRequest = async (request, updatedStatus) => {
    try {
      console.log(`Request with ID: ${request._id} updated to status: ${updatedStatus}`);
      await updateRequest(request._id, { status: updatedStatus }, user.token);
      setRequests((prevRequests) =>
      prevRequests.map((req) => (req._id === request._id ? { ...req, status: updatedStatus } : req))
    );
    } catch (error) {
      setError('Error updating request. Please try again later.');
    }
  }

  const handleRemoveRequest = async (requestId) => {
    try {
      console.log(`Request with ID: ${requestId} removed`);
      await removeRequest(requestId, user.token);
      setRequests(requests.filter(request => request._id !== requestId));
    } catch (error) {
      setError('Error removing request. Please try again later.');
    }
  };

  const handleSearch = (query) => setSearchQuery(query);

  const filteredRequests = requests.filter(request =>
    request.name.toLowerCase().includes(searchQuery.toLowerCase())
    || request.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const fetchRequests = async (id, token) => {
    let data;
    if (user.isAdmin) {
      data = await getRequests();
    } else {
      data = await getUserRequests(id);
    }
    setRequests(data);
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>; // Display error message

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
            <div className="no-requests">No requests found.</div>
          )}
       </div>
    </div>
  );
};

export default RequestList;
