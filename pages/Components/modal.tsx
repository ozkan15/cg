import { useContext } from "react";
import { TContext } from "../../src/common/tournamentContext";
import { ModalParameters } from "../../src/common/types";
/*
used for showing notifications
*/
const Modal = (props: { payload: ModalParameters }) => {
    if (!props.payload.visibility) return null;

    return (
        <div>
            <div id="modal-panel">
                <div className="row">
                    <div className="header left col-12">
                        <div className="title-container">
                            <div className="title">{props.payload.title}</div>
                        </div>
                        <hr />
                    </div>
                    <div className="body col-12 pb-4">
                        {props.payload.message}
                    </div>
                    <div className="col-12">
                        <div className="row">
                            <div className="form-group col-12">
                                <div className="row">
                                    <div className="col-6">
                                        <button type="button" onClick={props.payload.onCancel} className="form-control btn btn-danger btn-block">
                                            <div className="text">CANCEL</div>
                                        </button>
                                    </div>
                                    <div className="col-6">
                                        <button type="submit" onClick={props.payload.onConfirmation} className="form-control btn btn-primary btn-block">
                                            <div className="text">SAVE</div>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            <div className="background-shadow"></div>
        </div>
    );
};

export default Modal;
