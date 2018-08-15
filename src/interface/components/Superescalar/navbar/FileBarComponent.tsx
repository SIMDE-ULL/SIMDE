import * as React from 'react';
import { translate } from 'react-i18next';
import { t } from 'i18next';
import { connect } from 'react-redux';
import { toggleLoadModal, toggleAuthorModal, toggleOptionsModal, toggleSuperConfigModal, toggleBatchModal } from '../../../actions/modals';
import { bindActionCreators } from 'redux';
import { DropdownButton, MenuItem } from 'react-bootstrap';
import { viewBasicBlocks } from '../../../actions';

class FileBarComponent extends React.Component<any, any> {
    private color: boolean;

    constructor(public props: any, public state: any) {
        super(props);
        this.color = false;
    }

    render() {
        return (<div className='smd-filebar'>
                    <DropdownButton
                        title={t('fileBar.file.name')}
                        key={'dropdown-load'}
                        id={'dropdown-load'}
                        noCaret
                    >
                        <MenuItem eventKey="1" onClick={() => { this.props.actions.toggleLoadModal(true) }}>{t('fileBar.file.load')}</MenuItem>
                    </DropdownButton>
                    <DropdownButton
                        title={t('fileBar.view.name')}
                        key={'dropdown-view'}
                        id={'dropdown-view'}
                        noCaret
                    >
                        <MenuItem eventKey="1" onClick={() => {
                            this.color = !this.color;
                            this.props.actions.viewBasicBlocks(this.color);
                        }}>{t('fileBar.view.basicBlocks')}</MenuItem>
                    </DropdownButton>
                    <DropdownButton
                        title={t('fileBar.config.name')}
                        key={'dropdown-options'}
                        id={'dropdown-options'}
                        noCaret
                    >
                        <MenuItem eventKey="1" onClick={() => { this.props.actions.toggleSuperConfigModal(true)}}>
                            {t('fileBar.config.superescalar')}
                        </MenuItem>
                        <MenuItem eventKey="1" onClick={() => { this.props.actions.toggleLoadContentModal(true)}}>
                            {t('fileBar.config.content')}
                        </MenuItem>
                    </DropdownButton>
                    <DropdownButton
                        title={t('fileBar.experimentation.name')}
                        key={'dropdown-experimentation'}
                        id={'dropdown-experimentation'}
                        noCaret
                    >
                        <MenuItem eventKey="2" onClick={() => { this.props.actions.toggleBatchModal(true) }}>
                            {t('fileBar.experimentation.batch')}
                        </MenuItem>
                    </DropdownButton>
                    <DropdownButton
                        title={t('fileBar.help.name')}
                        key={'dropdown-help'}
                        id={'dropdown-help'}
                        noCaret
                    >
                        <MenuItem eventKey="1" href="https://etsiiull.gitbooks.io/simde/">
                            {t('fileBar.help.docs')}
                        </MenuItem>

                        <MenuItem eventKey="2" onClick={() => { this.props.actions.toggleAuthorModal(true) }}>{t('fileBar.help.about')}</MenuItem>
                    </DropdownButton>
        </div>);
    }
}

const mapStateToProps = state => {
    return {
        isLoadModalOpen: state.isLoadModalOpen,
    }
}

function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators({ 
        toggleLoadModal,
        toggleAuthorModal,
        toggleOptionsModal,
        toggleSuperConfigModal,
        toggleLoadContentModal,
        toggleBatchModal,
        viewBasicBlocks
    }, dispatch) };
}


export default translate('common', { wait: true })(connect(mapStateToProps, mapDispatchToProps)(FileBarComponent));
