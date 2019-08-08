function SmallHeader({onLogout,goToCategories,user}) {

  return (
    <>
      <img
        src="https://images.gog.com/87aecb600554d68a9c5b58c757bc0a2ded9fd7b27c635ef6d57d748765cb9d43.png"
        alt=""
      />

      <p>Welcome {user.name}</p>
      <a href="" onClick={ event => {
        event.preventDefault()
        onLogout()
      }
      }>Logout</a>

<a href="" onClick={ event => {
        event.preventDefault()
        goToCategories()
      }
      }>Categories</a>
      
      <a href="">Favorites</a>

    </>
  )
}
