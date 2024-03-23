import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    fetch('/fetchData')
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('/saveContact', formData)
      .then((response) => {
        console.log('Contact saved:', response.data);
        fetchData(); // Optionally, refresh the data
      })
      .catch((error) => {
        console.error('Error saving contact:', error);
      });
  };

  return (
    <div className="modal fade background-model" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content background-body">
          <div className="modal-header mb-3">
            <h5 className="phone-book-heading" id="exampleModalLabel">Contacts</h5>
            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <input
                required
                type="text"
                className="enter-input"
                placeholder="Name.."
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
              <input
                onKeyDown={handleKeypress}
                type="tel"
                id="mobilenumber"
                pattern="[0-9]+"
                minLength={10}
                maxLength={10}
                className="enter-input"
                placeholder="phonenumber.."
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="modal-footer">
              <button type="submit" className="custom-button bg-info text-white mt-5">Save</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default App;
