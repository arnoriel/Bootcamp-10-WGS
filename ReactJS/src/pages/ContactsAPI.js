import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './ContactsAPI.css';

const ContactsAPI = () => {
    const [contacts, setContacts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [newContact, setNewContact] = useState({ name: '', email: '', mobile: '' });
    const [editingContact, setEditingContact] = useState(null);
    const [oldName, setOldName] = useState('');

    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = () => {
        axios.get('http://localhost:3000/api/contacts')
            .then(response => {
                setContacts(response.data);
            })
            .catch(error => {
                console.error('Error fetching contacts:', error);
            });
    };

    const handleSearch = () => {
        axios.get(`http://localhost:3000/api/contacts/search?q=${searchQuery}`)
            .then(response => {
                setContacts(response.data);
            })
            .catch(error => {
                console.error('Error fetching contacts:', error);
            });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (editingContact) {
            setEditingContact(prevState => ({ ...prevState, [name]: value }));
        } else {
            setNewContact(prevState => ({ ...prevState, [name]: value }));
        }
    };

    const handleAddOrEditContact = () => {
        if (editingContact) {
            // Edit mode
            axios.put(`http://localhost:3000/api/contacts/${oldName}`, editingContact)
                .then(response => {
                    setContacts(contacts.map(contact => 
                        contact.name === oldName ? response.data : contact
                    ));
                    resetForm();
                })
                .catch(error => {
                    console.error('Error editing contact:', error);
                });
        } else {
            // Add mode
            axios.post('http://localhost:3000/api/contacts', newContact)
                .then(response => {
                    setContacts([...contacts, response.data]);
                    resetForm();
                })
                .catch(error => {
                    console.error('Error adding contact:', error);
                });
        }
    };

    const resetForm = () => {
        setNewContact({ name: '', email: '', mobile: '' });
        setEditingContact(null);
        setOldName('');
    };

    const handleDeleteContact = (id) => {
        axios.delete(`http://localhost:3000/api/contacts/${id}`)
            .then(() => {
                setContacts(contacts.filter(contact => contact.id !== id));
            })
            .catch(error => {
                console.error('Error deleting contact:', error);
            });
    };
    
    const startEditing = (contact) => {
        setEditingContact(contact);
        setOldName(contact.name);
    };

    return (
        <div className="container">
        <h1>Contacts List</h1>
        
        <div className="search-bar">
            <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search contacts..."
            />
            <button onClick={handleSearch}>Search</button>
        </div>

        <div>
            <h2>{editingContact ? 'Edit Contact' : 'Add New Contact'}</h2>
            <input
                type="text"
                name="name"
                value={editingContact ? editingContact.name : newContact.name}
                onChange={handleInputChange}
                placeholder="Name"
            />
            <input
                type="email"
                name="email"
                value={editingContact ? editingContact.email : newContact.email}
                onChange={handleInputChange}
                placeholder="Email"
            />
            <input
                type="text"
                name="mobile"
                value={editingContact ? editingContact.mobile : newContact.mobile}
                onChange={handleInputChange}
                placeholder="Mobile"
            />
            <button onClick={handleAddOrEditContact}>
                {editingContact ? 'Save Changes' : 'Add Contact'}
            </button>
        </div>

        <div className="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Mobile</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {contacts.map(contact => (
                        <tr key={contact.id}>
                            <td>{contact.name}</td>
                            <td>{contact.email}</td>
                            <td>{contact.mobile}</td>
                            <td className="actions">
                                <button className="edit-btn" onClick={() => startEditing(contact)}>Edit</button>
                                <button className="delete-btn" onClick={() => handleDeleteContact(contact.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
    );
};

export default ContactsAPI;
