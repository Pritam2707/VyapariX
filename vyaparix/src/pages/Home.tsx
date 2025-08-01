import ProductCard2 from "../Components/Modals/ProductCard2";
import { useProducts } from "../hooks/useProducts";

const Home = () => {
  const {
    products,
    isSearch,
    searchResults,
  } = useProducts();

  const displayedProducts = isSearch ? searchResults : products;

  return (
    <div className="bg-teal-950 flex flex-col gap-4 w-screen min-h-screen">
      <div className="flex justify-between items-center m-4">
        <h1 className="text-xl text-white">Storefront: Recently Added</h1>

      </div>

      <div className="flex flex-wrap">
        {displayedProducts.map((p) => (
          <div className="flex-none basis-1/2 md:basis-1/3 xl:basis-1/4 my-4" key={p.docID}>
            <ProductCard2
              docID={p?.docID || ""}
              product={p}
              whatPage="home"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
