import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase"; // adjust path
import { useCart } from "../hooks/useCart";
import type { product } from "../types/types"; // your product type
import placeholderimage from '../assets/placeholderimage.jpg';
import { useNavigate } from "react-router-dom";
import ReviewComponent from "../Components/ReviewComponent";
import Review from "../Components/Modals/Review";

let c = 0
const ProductPage = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { productID } = useParams();

  const [product, setProduct] = useState<product | null>(null);

  const [avgRating, setAvgRating] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productID) return;
      const docRef = doc(db, "products", productID);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        setProduct({ id: snapshot.id, ...snapshot.data() } as product);
      }
    };

    fetchProduct();
  }, [productID]);
  //  INSERT CODE TO CALCULATE AVERAGE RATING and store in rating
  useEffect(() => {
    let sum = 0;
    let len = -1;

    const currentProduct = product;

    if (currentProduct && currentProduct.reviews) {
      currentProduct.reviews.forEach((r) => {
        sum += r.rating;
      });
      len = currentProduct.reviews.length;
    }

    let avgRating = 0;
    if (len > 0) {
      avgRating = sum / len;
    }

    setAvgRating(Math.trunc(Number(avgRating.toFixed(1))));
  }, [product]);

  return (
    <div className="flex flex-col gap-4 w-screen min-h-screen ">
      <h2 className="text-xl text-white mx-auto">Your options</h2>
      {product ? (
        <div>
          <section className="py-8 bg-white md:py-16 dark:bg-teal-950 antialiased">
            <div className="max-w-screen-xl px-4 mx-auto 2xl:px-0">
              <div className="lg:grid lg:grid-cols-2 lg:gap-8 xl:gap-16">
                <div className="shrink-0 max-w-md lg:max-w-lg mx-auto">

                  <img className="w-full " src={product.image_address || placeholderimage} onError={
                    (e) => {
                      e.preventDefault();
                      e.currentTarget.src = placeholderimage;
                    }
                  } alt="" />
                  {/* <img className="w-full hidden dark:block" src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/imac-front-dark.svg" alt="" /> */}
                </div>

                <div className="mt-6 sm:mt-8 lg:mt-0">
                  <h1
                    className="text-4xl font-semibold text-gray-900  dark:text-white underline "
                  >
                    {product.name}
                  </h1>
                  <div className="mt-2 mb-2 sm:items-center sm:gap-4 sm:flex">
                    <p
                      className="text-2xl font-extrabold text-gray-900 sm:text-3xl dark:text-white"
                    >
                      ₹{product.price}{product.soldBy ? (<span>, offered by <span className="text-blue-200 underline cursor-pointer" onClick={() => { navigate(`/sellerinfo/${product.sellerID}`) }}>{product.soldBy}</span></span>) : null}
                    </p>

                    {/* <div className="flex items-center gap-2 mt-2 sm:mt-0">
                      <div className="flex items-center gap-1">
                        <svg
                          className="w-4 h-4 text-yellow-300"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M13.849 4.22c-.684-1.626-3.014-1.626-3.698 0L8.397 8.387l-4.552.361c-1.775.14-2.495 2.331-1.142 3.477l3.468 2.937-1.06 4.392c-.413 1.713 1.472 3.067 2.992 2.149L12 19.35l3.897 2.354c1.52.918 3.405-.436 2.992-2.15l-1.06-4.39 3.468-2.938c1.353-1.146.633-3.336-1.142-3.477l-4.552-.36-1.754-4.17Z"
                          />
                        </svg>
                        <svg
                          className="w-4 h-4 text-yellow-300"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M13.849 4.22c-.684-1.626-3.014-1.626-3.698 0L8.397 8.387l-4.552.361c-1.775.14-2.495 2.331-1.142 3.477l3.468 2.937-1.06 4.392c-.413 1.713 1.472 3.067 2.992 2.149L12 19.35l3.897 2.354c1.52.918 3.405-.436 2.992-2.15l-1.06-4.39 3.468-2.938c1.353-1.146.633-3.336-1.142-3.477l-4.552-.36-1.754-4.17Z"
                          />
                        </svg>
                        <svg
                          className="w-4 h-4 text-yellow-300"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M13.849 4.22c-.684-1.626-3.014-1.626-3.698 0L8.397 8.387l-4.552.361c-1.775.14-2.495 2.331-1.142 3.477l3.468 2.937-1.06 4.392c-.413 1.713 1.472 3.067 2.992 2.149L12 19.35l3.897 2.354c1.52.918 3.405-.436 2.992-2.15l-1.06-4.39 3.468-2.938c1.353-1.146.633-3.336-1.142-3.477l-4.552-.36-1.754-4.17Z"
                          />
                        </svg>
                        <svg
                          className="w-4 h-4 text-yellow-300"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M13.849 4.22c-.684-1.626-3.014-1.626-3.698 0L8.397 8.387l-4.552.361c-1.775.14-2.495 2.331-1.142 3.477l3.468 2.937-1.06 4.392c-.413 1.713 1.472 3.067 2.992 2.149L12 19.35l3.897 2.354c1.52.918 3.405-.436 2.992-2.15l-1.06-4.39 3.468-2.938c1.353-1.146.633-3.336-1.142-3.477l-4.552-.36-1.754-4.17Z"
                          />
                        </svg>
                        <svg
                          className="w-4 h-4 text-yellow-300"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M13.849 4.22c-.684-1.626-3.014-1.626-3.698 0L8.397 8.387l-4.552.361c-1.775.14-2.495 2.331-1.142 3.477l3.468 2.937-1.06 4.392c-.413 1.713 1.472 3.067 2.992 2.149L12 19.35l3.897 2.354c1.52.918 3.405-.436 2.992-2.15l-1.06-4.39 3.468-2.938c1.353-1.146.633-3.336-1.142-3.477l-4.552-.36-1.754-4.17Z"
                          />
                        </svg>
                      </div>
                      {/* <p
                        className="text-sm font-medium leading-none text-gray-500 dark:text-gray-400"
                      >
                        (5.0)
                      </p> */}
                    {/* <a
                        href="#"
                        className="text-sm font-medium leading-none text-gray-900 underline hover:no-underline dark:text-white"
                      >
                        345 Reviews
                      </a> */}
                    {/* </div> */}
                  </div>

                  {/* <div className="mt-3 sm:gap-4 sm:items-center sm:flex sm:mt-8">


                    {/* <a
                      href="#"
                      title=""
                      className="text-white mt-4 sm:mt-0 bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800 flex items-center justify-center"
                      role="button"
                    >
                      <svg
                        className="w-5 h-5 -ms-2 me-2"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M4 4h1.5L8 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm.75-3H7.5M11 7H6.312M17 4v6m-3-3h6"
                        />
                      </svg>

                      Add to cart
                    </a> */}
                  {/* </div> */}
                  {/* 
                  <hr className="my-2 md:my-2 border-gray-200 dark:border-gray-800" /> */}

                  <div className=" text-gray-500 dark:text-gray-400">
                    {/* <p className="my-3 text-3xl underline">Description</p> */}
                    <div className="mb-2 flex overflow-x-scroll hide-scrollbar" >
                      {product?.tag?.map((t) => {

                        return (
                          <span key={c++} className="bg-teal-50 text-teal-600 px-3 py-1.5 text-xs font-medium whitespace-nowrap mr-2"> {t} </span>
                        )
                      })}
                    </div>
                    <Review rating={avgRating} />
                    {product.description}
                    <br />

                  </div>


                </div>
                <button
                  title=""
                  className=" flex items-center justify-center py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                  role="button"
                  onClick={() => addToCart(product)}
                >
                  <svg
                    className="w-5 h-5 -ms-2 me-2"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12.01 6.001C6.5 1 1 8 5.782 13.001L12.011 20l6.23-7C23 8 17.5 1 12.01 6.002Z"
                    />
                  </svg>
                  Add to Cart
                </button>

              </div>
              <hr className="my-12 h-0.5 border-t-0 bg-neutral-100 dark:bg-white/10" />
              <div>
                <div className="my-3 text-3xl underline text-white">Reviews</div>
                {product?.reviews?.map((r) => (<div><ReviewComponent username={r.user_name} rating={r.rating} comment={r.comment || ""} />
                  <hr className="my-4 h-0.5 border-t-0 bg-neutral-100 dark:bg-white/10" /></div>))}

              </div>
            </div>

          </section>


        </div >
      ) : (
        <p>Loading product...</p>
      )}
    </div >
  );
};

export default ProductPage;
