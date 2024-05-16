export default function Post() {
    return (
      <div className="post">
        <div className="image">
          <img
            src="https://hips.hearstapps.com/hmg-prod/images/dog-puppy-on-garden-royalty-free-image-1586966191.jpg?crop=0.752xw:1.00xh;0.175xw,0&resize=1200:*"
            alt=""
          />
        </div>
        <div className="texts">
          <h2>Secrets about dogs</h2>
          <p className="info">
            <a className="author">Michelle Appiah</a>
            <time>2024-05-15 17:12</time>
          </p>
          <p className="summary">Today is a special day to learn about dogs</p>
        </div>
      </div>
    );
}