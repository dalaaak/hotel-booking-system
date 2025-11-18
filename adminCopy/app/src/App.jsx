import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Hotels from './components/Hotels';
import Room from './components/Room';
import SearchResults from './components/SearchResults';
import SearchForm from './components/SearchForm';
// ... باقي الاستيرادات

function App() {
  const [searchTerm, setSearchTerm] = useState('');

    const handleSearchSubmit = (term) => {
        setSearchTerm(term);
    };
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Hotels />} />
          <Route path="/hotel/:hotelId/rooms" element={<Room />} />
          <SearchForm onSubmitSearch={handleSearchSubmit} />
          <SearchResults results={sampleHotels} searchTerm={searchTerm} />
          {/* ... المسارات الأخرى */}
        </Routes>
      </div>
    </Router>
  );
}

export default App; 