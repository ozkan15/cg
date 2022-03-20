/*
create pagination for tournament list
*/
const Pagination = (props: { currentPage: number, onClick: (prePage: number, page: number) => void }) => {
    return <div id="index-pagination-container">
        <div className="btn btn-primary" onClick={() => props.onClick(props.currentPage, props.currentPage - 1)}><i className="fa fa-chevron-left"></i></div>
        {new Array(props.currentPage >= 3 ? 3 : props.currentPage).fill(props.currentPage - 2 > 0 ? props.currentPage - 2 : 1).map((s, index) => {
            if (index === 0) return <div key={s + index} onClick={() => props.onClick(props.currentPage, s + index)} className={"no-x-border btn btn-primary" + (props.currentPage === s + index ? " current-page" : "")}>{s + index}</div>;
            else return <div key={s + index} onClick={() => props.onClick(props.currentPage, s + index)} className={"no-right-border btn btn-primary" + (props.currentPage === s + index ? " current-page" : "")}>{s + index}</div>;
        })}
        <div className="btn btn-primary" onClick={() => props.onClick(props.currentPage, props.currentPage + 1)}><i className="fa fa-chevron-right"></i></div>
    </div>;
};

export default Pagination;