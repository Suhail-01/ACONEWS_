
import { React, useState, useEffect } from 'react';
import EverythingCard from './EverythingCard';
import Loader from './Loader';

function AllNews() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  function handlePrev() {
    setPage(page - 1);
  }

  function handleNext() {
    setPage(page + 1);
  }

  let pageSize = 12;
  let apiKey = '833c21509f6ef593fc013efd515a375c'; 
  let searchQuery = 'world';  // Default search query
  let lang = 'en';  // Default language (English)
  let country = 'us';  // Default country (US)

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    
    const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(searchQuery)}&lang=${lang}&country=${country}&max=${pageSize}&page=${page}&apikey=${apiKey}`;

    fetch(url)
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Network response was not ok');
      })
      .then(myJson => {
        if (myJson.articles) {
          setTotalResults(myJson.totalArticles);
          setData(myJson.articles);
        } else {
          setError(myJson.message || 'An error occurred');
        }
      })
      .catch(error => {
        console.error('Fetch error:', error);
        setError('Failed to fetch news. Please try again later.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [page]);

  return (
    <>
      {error && <div className="text-red-500 mb-4">{error}</div>}

      <div className='my-10 cards grid lg:place-content-center md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 xs:grid-cols-1 xs:gap-4 md:gap-10 lg:gap-14 md:px-16 xs:p-3 '>
        {!isLoading ? data.map((element, index) => (
          <EverythingCard
            title={element.title}
            description={element.description}
            imgUrl={element.image}
            publishedAt={element.publishedAt}
            url={element.url}
            author={element.source.name}
            source={element.source.name}
            key={index}
          />
        )) : <Loader />}
      </div>

      {!isLoading && data.length > 0 && (
        <div className="pagination flex justify-center gap-14 my-10 items-center">
          <button disabled={page <= 1} className='pagination-btn text-center' onClick={handlePrev}>&larr; Prev</button>
          <p className='font-semibold opacity-80'>{page} of {Math.ceil(totalResults / pageSize)}</p>
          <button className='pagination-btn text-center' disabled={page >= Math.ceil(totalResults / pageSize)} onClick={handleNext}>Next &rarr;</button>
        </div>
      )}
    </>
  );
}

export default AllNews;
