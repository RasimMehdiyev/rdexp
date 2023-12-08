if (loading) {
    return <LoadingPage />; // You can replace this with any loading spinner or indicator
} else {
    return (
        <div>
        <StickyEditTeamComponent onSave={onSave}/>
        <div className="grow flex bg-indigo-100 flex-col items-center justify-start h-screen">
            <div className="grow p-4 flex-col justify-start items-center gap-4 inline-flex">
                <div className="w-[329px] justify-center items-start gap-2.5 inline-flex">
                    <div className="w-[142px] h-[142px] relative">
                    
                        <label htmlFor="profilePictureInput">
                        {previewImage ? (
                        <img className="w-[142px] h-[142px] rounded-full object-cover overflow-hidden cursor-pointer" src={previewImage} alt="Preview" />
                        ) : (
                        <img className="w-[142px] h-[142px] rounded-full border-4 border-white cursor-pointer" src={process.env.PUBLIC_URL + "/images/no_user.png"} alt="No user" />
                        )}

                        <div className="w-[35px] h-[35px] left-[107px] top-[98px] absolute">
                        <div className="w-[35px] h-[35px] left-[-3px] top-0 absolute bg-blue-600 rounded-full flex justify-center items-center cursor-pointer">
                            <PencilIcon className="h-6 w-6 text-white" />
                        </div>
                        </div>
                        </label>
                        <input
                            type="file"
                            id="profilePictureInput"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={handleImageChange}
                        
                        />
                    </div>
                </div>
                <div className="flex-col justify-start items-start gap-2 flex">
                    <div className="flex-col justify-start items-start gap-1 flex">
                        <div className="px-4 justify-start items-start gap-2.5 inline-flex">
                            <div className="text-blue-600 text-xl font-russoOne">Team Name</div>
                        </div>
                        <div className="w-[322px] h-8 pl-5 pr-4 py-3 bg-white rounded-md border border-blue-600  justify-start items-center gap-2.5 inline-flex">
                            <div className="w-full h-auto basis-0 justify-start items-center flex">
                                <input
                                    className='text-neutral-500 text-base font-normal font-interReg leading-normal'
                                    placeholder={newTeamName}
                                    type="text"
                                    value={newTeamName}
                                        onChange={(event) => {
                                            setNewTeamName(event.target.value);
                                         }
                                    } />
                            </div>
                        </div>
                    </div>                                                 
                </div>
                <div className="flex-col justify-start items-start gap-2 flex">
                    <div className="flex-col justify-start items-start gap-1 flex">
                    <div className="px-4 justify-start items-start gap-2.5 inline-flex">
                        <div className="text-blue-600 text-xl font-russoOne">Contact details</div>
                    </div>
                    <div className="w-[322px] h-8 pl-5 pr-4 py-3 bg-white rounded-md border border-blue-600  justify-start items-center gap-2.5 inline-flex">
                        <EnvelopeIcon className="h-5 w-5 text-neutral-500"></EnvelopeIcon>
                        <div className="w-full h-auto basis-0 justify-start items-center flex">
                            <input
                                className='text-neutral-500 text-base font-normal font-interReg leading-normal'
                                placeholder={newEmail}
                                type="email"
                                value={newEmail}
                                    onChange={(event) => {
                                        setNewEmail(event.target.value);
                                        setEmailError(''); }
                                } />
                        </div>
                    </div>
                    {(emailError != '') ? <div className="text-red-500">{emailError}</div>:<div></div>}
                    <div className="w-[322px] h-8 pl-5 pr-4 py-3 bg-white rounded-md border border-blue-600 justify-start items-center gap-2.5 inline-flex">
                        <PhoneIcon className="h-5 w-5 text-neutral-500"></PhoneIcon>
                        <div className="w-full h-auto basis-0 justify-start items-center flex">                            
                            <input
                                className="text-neutral-500 text-base font-normal font-interReg leading-normal"
                                placeholder={newPhoneNumber}
                                type="tel"
                                value={newPhoneNumber}
                                        onChange={(event) => {
                                            setNewPhoneNumber(event.target.value);
                                            setPhoneNumberError('');
                                        }} />
                        </div>
                    </div>
                    {(phoneNumberError != '') ? <div className="text-red-500">{phoneNumberError}</div>:<div></div>}        
                    
                    <div className="w-[322px] h-8 pl-5 pr-4 py-3 bg-white rounded-md border border-blue-600 justify-start items-center gap-2.5 inline-flex">
                        <MapPinIcon className="h-5 w-5 text-neutral-500"></MapPinIcon>
                        <div className="w-full h-auto basis-0 justify-start items-center flex">                            
                            <input
                                className="text-neutral-500 text-base font-normal font-interReg leading-normal"
                                placeholder={newLocation}
                                type="text"
                                value={newLocation}
                                        onChange={(event) => {
                                            setNewLocation(event.target.value);
                                        }} />
                        </div>
                    </div>
                    <div className="w-[322px] h-8 pl-5 pr-4 py-3 bg-white rounded-md border border-blue-600 justify-start items-center gap-2.5 inline-flex">
                        <MapPinIcon className="h-5 w-5 text-neutral-500"></MapPinIcon>
                        <div className="w-full h-auto basis-0 justify-start items-center flex">                            
                            <input
                                className="text-neutral-500 text-base font-normal font-interReg leading-normal"
                                placeholder={newStadium}
                                type="text"
                                value={newStadium}
                                        onChange={(event) => {
                                            setNewStadium(event.target.value);
                                        }} />
                        </div>
                    </div>
                    </div>                                                 
                </div>

                <div className="flex-col justify-start items-start gap-2 flex">
                    <div className="flex-col justify-start items-start gap-1 flex">
                    <div className="px-4 justify-start items-start gap-2.5 inline-flex">
                        <div className="text-blue-600 text-xl font-russoOne">Socials</div>
                    </div>
                    <div className="w-[322px] h-8 pl-5 pr-4 py-3 bg-white rounded-md border border-blue-600  justify-start items-center gap-2.5 inline-flex">
                        <img src={`${process.env.PUBLIC_URL}/images/facebook.svg`} alt='facebook' />
                        <div className="w-full h-auto basis-0 justify-start items-center flex">
                            <input
                                className='text-neutral-500 text-base font-normal font-interReg leading-normal'
                                placeholder={newFacebook}
                                type="text"
                                value={newFacebook}
                                    onChange={(event) => {
                                        setNewFacebook>(event.target.value);
                                    }
                                } />
                        </div>
                    </div>
                    <div className="w-[322px] h-8 pl-5 pr-4 py-3 bg-white rounded-md border border-blue-600  justify-start items-center gap-2.5 inline-flex">
                        <img src={`${process.env.PUBLIC_URL}/images/instagram.svg`} alt='instagram' />
                        <div className="w-full h-auto basis-0 justify-start items-center flex">
                            <input
                                className='text-neutral-500 text-base font-normal font-interReg leading-normal'
                                placeholder={newInstagram}
                                type="text"
                                value={newInstagram}
                                    onChange={(event) => {
                                        setNewInstagram>(event.target.value);
                                    }
                                } />
                        </div>
                    </div>
                    
                    <div className="w-[322px] h-8 pl-5 pr-4 py-3 bg-white rounded-md border border-blue-600  justify-start items-center gap-2.5 inline-flex">
                        <img src={`${process.env.PUBLIC_URL}/images/twitter.svg`} alt='twitter' />
                        <div className="w-full h-auto basis-0 justify-start items-center flex">
                            <input
                                className='text-neutral-500 text-base font-normal font-interReg leading-normal'
                                placeholder={newX}
                                type="text"
                                value={newX}
                                    onChange={(event) => {
                                        setNewX>(event.target.value);
                                    }
                                } />
                        </div>
                    </div>
                    </div>                                                 
                </div>

                <div className="flex-col justify-start items-start gap-1 flex">
                    <div className="w-[178px] px-4 justify-start items-start gap-2.5 inline-flex">
                        <div className="text-blue-600 text-xl font-russoOne">Bio</div>
                    </div>
                    <div className="w-[322px] px-4 py-1 bg-white rounded-md border border-blue-600  justify-start items-center inline-flex">
                        <div className="grow h-auto basis-0 justify-start items-center flex">
                            <textarea
                                value={newBio}
                                onChange={(event) => setNewBio(event.target.value)}
                                className="grow basis-0 text-neutral-500 text-sm font-normal font-interReg"
                                placeholder={clubData.description}
                                />
                        </div>
                    </div>
                </div>        
            </div>
            
            
            </div>
        </div>  
        
);
}