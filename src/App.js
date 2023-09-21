import logo from './logo.svg';
import './App.css';
import { useState,useEffect } from 'react';

function App() {
  const [products, setProducts] = useState([]);
  const [input, setInput] = useState('');
  const [isSearching, setIsSearching] = useState(false); //Logo doesn't Spin


  useEffect(() => {
    // Check if there are previously saved results in localStorage
    const savedResults = localStorage.getItem('savedResults');
    if (savedResults) {
      setProducts(JSON.parse(savedResults));
    }
  }, []);



  const handleInputChange = (e) => {
    setInput(e.target.value); // Update the input state as the user types
  };


  const handleSearch = (e) => {

    e.preventDefault(); // Prevent form submission

    setIsSearching(true); //Logo Starts Spinning


    // Fetch data when the input is not empty
    if (input.trim() !== '') {
      fetch(`https://api.mercadolibre.com/sites/MLA/search?q=${input}`)
        .then((res) => res.json())
        .then((data) => {
          setProducts(data.results);
          setIsSearching(false);
          // Save the results to localStorage
          localStorage.setItem('savedResults', JSON.stringify(data.results));
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
          setIsSearching(false);
          setProducts([]); // Clear the products in case of an error
        });
    } 
  };

  return (
    <div className="bg-gray-800 h-screen">
      <div className="flex flex-col items-center justify-start bg-gray-800">

        {/* isSearching is true Logo Spins */}
        
        {isSearching ? (
          <img src={logo} alt="Loading..." className="App-logo h-20 mt-5" />
        ) : (
          <img src={logo} alt="logo" className=" h-20 mt-5" />
        )}

        <h1 className='text-white'>Search in ML</h1>
        <form onSubmit={handleSearch} className="flex mt-5">
          <input
            onChange={handleInputChange}
            value={input}
            type="text"
            className="px-4 py-2 border border-gray-400 rounded"
            placeholder="Type to Search..."
          />
          <button
            type="submit" // Set as submit button
            className="bg-blue-700 text-white p-4 py-2 rounded ml-[2px]"
          >
            Search
          </button>
          <button
            type="button" // Set as reset button
            className=" bg-red-400 text-white px-4 py-2 ml-2 rounded"

            // Clear input, Products & localStorage
            onClick={() => {

              setInput('')
              setProducts([])
              localStorage.setItem('savedResults', '');

            } }
          >
            Clear
          </button>
        </form>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
          {products.map((product, index) => (
            <div
              key={index}
              className="bg-white shadow-md border border-gray-200 rounded-lg max-w-sm dark:bg-gray-800 dark:border-gray-700 text-center flex flex-col justify-center items-center"
            >
              <a href={product.permalink}>
                <img
                  className="rounded-t-lg object-cover h-48 w-full"
                  src={product.thumbnail}
                  alt=""
                />
              </a>
              <div className="p-5">
                <a href={product.permalink}>
                  <h5
                    key={index}
                    className="text-gray-900 font-bold text-2xl tracking-tight mb-2 dark:text-white"
                  >
                    {product.title}
                  </h5>
                </a>
                <p className="font-normal text-gray-700 mb-3 text-white">
                  $ {product.price}
                </p>
                <a
                  href={product.permalink}
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-2 text-center inline-flex items-center  dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Read more
                  <svg
                    className="-mr-1 ml-2 h-4 w-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
