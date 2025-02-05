function CountCards({ stat }) {
    return (
      <div className="bg-main text-white p-8 rounded-lg shadow-lg flex flex-col items-center">
        <div className="text-2xl">{stat.icon}</div>
        <h3 className="text-lg font-semibold">{stat.title}</h3>
        <p className="text-xl font-bold">{stat.count}</p>
      </div>
    );
  }
  
  export default CountCards;
  