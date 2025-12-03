import React from "react";

const NewsCard = ({ title, description, url }) => {
return (
<div className="news-card p-4 m-2 bg-gray-100 rounded shadow-md">
<h3 className="font-semibold">{title}</h3>
<p className="text-sm my-1">{description}</p>
<a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
Read more
</a>
</div>
);
};

export default NewsCard;