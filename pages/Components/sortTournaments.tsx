import React, { Fragment, useEffect, useState } from "react";
/*
manages tournament editing
*/
const SortTournaments = (props: { children: React.ReactNode, onChange: (value: string) => void, defaultValue: string }) => {
    function onChangeHandler(event: React.ChangeEvent<HTMLSelectElement>) {
        if (typeof props.onChange === "function") props.onChange(event.target.value);
    }

    return <div className="pb-4">
        <span style={{ color: "white" }}>Sort:</span>
        <div className="form-group">
            <div>
                <select defaultValue={props.defaultValue} onChange={onChangeHandler} className="form-control">
                    {props.children}
                </select>
            </div>
        </div>
    </div>
};

export default SortTournaments;