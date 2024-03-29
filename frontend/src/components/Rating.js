const Rating = ({value, color}) => {
    return (
        <div className="rating d-flex justify-content-center">
            <h3>
                <i style={{color}} className={
                    value >= 1
                        ? 'fas fa-star'
                        : value >= 0.5
                            ? 'fas fa-star-half-alt'
                            : 'far fa-star'
                }>

                </i>
            </h3>
            <h3>
                <i style={{color}} className={
                    value >= 2
                        ? 'fas fa-star'
                        : value >= 1.5
                            ? 'fas fa-star-half-alt'
                            : 'far fa-star'
                }>

                </i>
            </h3>
            <h3>
                <i style={{color}} className={
                    value >= 3
                        ? 'fas fa-star'
                        : value >= 2.5
                            ? 'fas fa-star-half-alt'
                            : 'far fa-star'
                }>

                </i>
            </h3>
            <h3>
                <i style={{color}} className={
                    value >= 4
                        ? 'fas fa-star'
                        : value >= 3.5
                            ? 'fas fa-star-half-alt'
                            : 'far fa-star'
                }>

                </i>
            </h3>
            <h3>
                <i style={{color}} className={
                    value >= 5
                        ? 'fas fa-star'
                        : value >= 4.5
                            ? 'fas fa-star-half-alt'
                            : 'far fa-star'
                }>

                </i>
            </h3>
        </div>
    )
}

export default Rating